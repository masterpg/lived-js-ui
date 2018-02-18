const { customElement, query } = Polymer.decorators;

import '../styles/base-styles';
import '@polymer/polymer/polymer';
import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer';
import { LivedCollapseItem } from "../lived-collapse-item/lived-collapse-item";
import { html } from '@polymer/polymer/lib/utils/html-tag';

@customElement('lived-collapse')
export class LivedCollapse extends PolymerElement {

  static get template() {
    return html`
      <style include="base-styles">
        :host {
          --lived-collapse-item-border-style: var(--lived-collapse-border-style, solid);
          --lived-collapse-item-border-color: var(--lived-collapse-border-color, #DDDDDD);
          --lived-collapse-item-border-width: var(--lived-collapse-border-width, 1px);
        }

        .container {
          border-style: var(--lived-collapse-border-style, solid);
          border-color: var(--lived-collapse-border-color, #DDDDDD);
          border-width: var(--lived-collapse-border-width, 1px);
        }
      </style>

      <div class="container">
        <slot id="slot"></slot>
      </div>
    `;
  }

  //----------------------------------------------------------------------
  //
  //  Variables
  //
  //----------------------------------------------------------------------

  __toggleCollapseItemListeners =
    new WeakMap<LivedCollapseItem, EventListener>();

  //--------------------------------------------------
  //  Elements
  //--------------------------------------------------

  @query('#slot')
  __slot: HTMLSlotElement | undefined;

  //----------------------------------------------------------------------
  //
  //  Lifecycle callbacks
  //
  //----------------------------------------------------------------------

  ready() {
    super.ready();

    if (!this.__slot) throw new Error(`__slot is ${this.__slot}.`);

    new FlattenedNodesObserver(this.__slot, (info) => {
      // 追加されたアイテムの処理
      for (const addedItem of info.addedNodes as LivedCollapseItem[]) {
        if (!(addedItem instanceof HTMLElement)) continue;
        if (!(addedItem instanceof LivedCollapseItem)) {
          throw new Error('Light DOM must be LivedCollapseItem.');
        }
        const listener = this.__collapseItemOnToggleCollapseItem.bind(this);
        this.__toggleCollapseItemListeners.set(addedItem, listener);
        addedItem.addEventListener('toggle-collapse-item', listener);
      }
      // 削除されたアイテムの処理
      for (const removedItem of info.removedNodes as LivedCollapseItem[]) {
        const listener = this.__toggleCollapseItemListeners.get(removedItem);
        this.__toggleCollapseItemListeners.delete(removedItem);
        if (listener) {
          removedItem.removeEventListener('toggle-collapse-item', listener);
        }
      }
      // アイテム間のボーダー設定
      this.__setupCollapseBorder();
    });
  }

  //----------------------------------------------------------------------
  //
  //  Internal methods
  //
  //----------------------------------------------------------------------

  /**
   * アイテム間のボーダーを設定します。
   */
  __setupCollapseBorder(): void {
    const items = this.__getCollapseItems();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (i === items.length - 1) {
        // 最下部のアイテムのボーダーは非表示にする
        // (アイテムのボーダーとコンテナの枠線がかぶるため)
        item.updateStyles({
          '--lived-collapse-item-border-style': 'none',
        });
      } else {
        item.updateStyles({
          '--lived-collapse-item-border-style': 'solid',
        });
      }
    }
  }

  /**
   * slotタグに挿入されたアイテムを取得します。
   */
  __getCollapseItems(): LivedCollapseItem[] {
    if (!this.__slot) return [];
    const assignedNodes = this.__slot.assignedNodes({ flatten: false });
    return assignedNodes.filter((node) => {
      return node instanceof LivedCollapseItem;
    }) as any[];
  }

  //----------------------------------------------------------------------
  //
  //  Event handlers
  //
  //----------------------------------------------------------------------

  /**
   * アイテムが開閉された際のハンドラです。
   * @param event
   */
  __collapseItemOnToggleCollapseItem(event) {
    // 必要があれば用のプレースホルダ
  }

}

const { customElement, property, query } = Polymer.decorators;

import '../styles/base-styles';
import '@polymer/iron-collapse/iron-collapse';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-icons/iron-icons';
import '@polymer/polymer/polymer';
import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import {
  GestureEventListeners,
  GestureEventListenersConstructor
} from '@polymer/polymer/lib/mixins/gesture-event-listeners';
import { html } from '@polymer/polymer/lib/utils/html-tag';

@customElement('lived-collapse-item')
export class LivedCollapseItem extends GestureEventListeners(PolymerElement) {

  static get template() {
    return html`
      <style include="base-styles">
        .container {
          border-bottom-style: var(--lived-collapse-item-border-style, solid);
          border-bottom-color: var(--lived-collapse-item-border-color, #DDDDDD);
          border-bottom-width: var(--lived-collapse-item-border-width, 1px);
        }

        .header {
          min-height: 48px;
          padding-left: 16px;
          text-align: left;
          color: var(--primary-text-color);
          @apply(--paper-font-menu);
          cursor: pointer;
        }

        .icon {
          margin-right: 16px;
          --iron-icon-height: 24px;
          --iron-icon-width: 24px;
        }

        .toogle {
          padding-right: 16px;
          color: var(--disabled-text-color);
        }

        .content {
          padding-left: 30px;
          text-align: left;
          color: var(--primary-text-color);
          @apply(--paper-font-body1);
        }

        .content > div {
          padding-bottom: 16px;
        }
      </style>

      <div class="container">
        <div class="layout horizontal center-center header" on-tap="__headerOnTap">
          <iron-icon id="icon" class="icon" src="[[src]]" icon="[[icon]]"></iron-icon>
          <div class="flex">[[headerText]]</div>
          <iron-icon class="toogle" icon="[[__toggleIcon]]"></iron-icon>
        </div>
        <iron-collapse class="content" opened="{{opened}}">
          <div><slot></slot></div>
        </iron-collapse>
      </div>
    `;
  }

  //----------------------------------------------------------------------
  //
  //  Variables
  //
  //----------------------------------------------------------------------

  @property({ type: String, computed: '__computeToggleIcon(opened)' })
  __toggleIcon: string = '';

  __computeToggleIcon(opened: boolean) {
    return opened ? 'icons:expand-less' : 'icons:expand-more';
  }

  //--------------------------------------------------
  //  Elements
  //--------------------------------------------------

  @query('#icon')
  __icon: HTMLElement | undefined;

  //----------------------------------------------------------------------
  //
  //  Properties
  //
  //----------------------------------------------------------------------

  /**
   * ヘッダーテキストです。
   */
  @property({ type: String })
  headerText: string = '';

  /**
   * ヘッダーのアイコンです。
   * 例: "icons:info"
   */
  @property({ type: String })
  icon: string = '';

  /**
   * ヘッダーアイコンのURLです。
   * Polymerで用意されている以外のアイコンを使用したい場合は
   * iconプロパティではなくこのプロパティでアイコンのURLを指定してください。
   */
  @property({ type: String })
  src: string = '';

  /**
   * アイテムの開閉です。
   */
  @property({ type: Boolean })
  opened: boolean = false;

  /**
   * 下部のボーダー表示有無です。
   */
  @property({ type: Boolean })
  borderBottom: boolean = false;

  //----------------------------------------------------------------------
  //
  //  Lifecycle callbacks
  //
  //----------------------------------------------------------------------

  constructor() {
    super();
  }

  ready() {
    super.ready();

    // アイコン指定がない場合
    if (!this.icon && !this.src) {
      if (this.__icon) {
        this.__icon.style.display = 'none';
      }
    }
  }

  //----------------------------------------------------------------------
  //
  //  Internal methods
  //
  //----------------------------------------------------------------------

  __headerOnTap(event) {
    this.opened = !this.opened;
    this.dispatchEvent(new CustomEvent('toggle-collapse-item'));
  }

}

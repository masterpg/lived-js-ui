const { customElement, property } = Polymer.decorators;

import '../styles/base-styles';
import '@polymer/polymer/polymer';
import { Element as PolymerElement } from '@polymer/polymer/polymer-element';
import { html } from '@polymer/polymer/lib/utils/html-tag';

@customElement('lived-my-element')
export class MyElement extends PolymerElement {

  static get template() {
    return html`
      <style include="base-styles">
        .container {
          border: solid 1px #DDDDDD;
          margin: 20px 0;
          padding: 20px;
        }

        .container > * {
          margin-right: 10px;
        }

        .container > *:last-child {
          margin-right: 0;
        }
      </style>

      <div class="layout horizontal container">
        <div>Hello [[greeting]]</div>
        <button on-click="__clickHandler">Click me!</button>
      </div>
    `;
  }

  //----------------------------------------------------------------------
  //
  //  Properties
  //
  //----------------------------------------------------------------------

  @property({ type: String, notify: true })
  greeting: string = '';

  //----------------------------------------------------------------------
  //
  //  Event handlers
  //
  //----------------------------------------------------------------------

  __clickHandler(event) {
    alert('clicked');
  }

}
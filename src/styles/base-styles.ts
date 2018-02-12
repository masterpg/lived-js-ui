import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-flex-layout/iron-flex-layout-classes';
import '@polymer/paper-styles/color';
import '@polymer/paper-styles/default-theme';
import '@polymer/paper-styles/typography';
import '@polymer/polymer/polymer';

const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `
  <dom-module id="base-styles">
    <template>
      <style include="iron-flex iron-flex-alignment iron-flex-reverse iron-flex-factors iron-positioning">

        :host {
          box-sizing: border-box;
        }

        title, div, span, h1, h2, h3, h4, h5, h6, address, p, br, code, pre, hr, a, link,
        ul, ol, li, img, table, caption thead, tbody, colgroup, col, tr, td, th, frameset,
        frame, noframes, iframe, form, input, textarea, select, option, optgroup, button,
        label, fieldset, legend {
          box-sizing: border-box;
        }
        
        * {
          outline: none;
        }

        .hidden {
          display: none;
        }

      </style>
    </template>
  </dom-module>
`;

document.head.appendChild($_documentContainer);

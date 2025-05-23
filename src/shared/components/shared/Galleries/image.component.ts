import { css, html, LitElement } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { customElement, property } from "lit/decorators.js";
import { resolveUrl } from "../../../directives/resolve-url.directive";

@customElement("sn-img")
export class SNImg extends LitElement {
  @property({ reflect: true })
  src?: string;

  @property({ reflect: true })
  placeholder?: string;

  @property({ reflect: true })
  alt?: string;

  static styles = [
    css`
    img {
      height: auto;
      width: 100%;
    }
    `
  ]

  protected render() {
    return html`
      <img
        part="img"
        width="200"
        height="200"
        style="object-fit: cover; object-position: center;"
        src=${ifDefined(resolveUrl(this.src))}
        alt=${ifDefined(this.alt)}
      />
    `;
  }
}

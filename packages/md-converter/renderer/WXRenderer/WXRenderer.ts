import { Renderer } from "marked";
import { makeStyleText } from "../../utils";
import { BaseRenderer } from "../BaseRenderer";
import {
  EMConverterFactory,
  headingConverterFactory,
  HRConverterFactory,
  linkConverterFactory,
  listConverterFactory,
  listItemConverterFactory,
  paragraphConverterFactory,
  quoteConverterFactory,
  strongConverterFactory,
  codeConverterFactory,
  codeSpanConverterFactory,
} from "./converters";

interface FootNote {
  title: string;
  href: string;
}

export class WXRenderer extends BaseRenderer {
  private footNotes: FootNote[] = [];

  private addFootNote = (title: string, href: string) => {
    const length = this.footNotes.push({ title, href });
    return length;
  };

  private buildFootNotes = () => {
    let notes = this.footNotes.map(({ title, href }, index) => {
      if (title === href) {
        return `<code style="font-size: 90%; opacity: 0.6;">[${
          index + 1
        }]</code>: <em style="${makeStyleText(
          this.theme.footNotes?.item,
        )}">${title}</em><br/>`;
      }
      return `<code style="font-size: 90%; opacity: 0.6;">[${
        index + 1
      }]</code><em style="${makeStyleText(
        this.theme.footNotes?.item,
      )}">${title}: ${href}</em><br/>`;
    });
    if (notes.length === 0) {
      return "";
    }
    return `<h4 style="${makeStyleText(
      this.theme.heading.h4,
    )}">相关引用</h4><p style="${makeStyleText(
      this.theme.footNotes.container,
    )}">${notes.join("\n")}</p>`;
  };

  buildSuffix() {
    const suffix = "";
    const footNotes = this.buildFootNotes();
    return suffix + footNotes;
  }

  assemble(): Partial<Renderer> {
    return {
      em: EMConverterFactory(this.theme),
      heading: headingConverterFactory(this.theme),
      hr: HRConverterFactory(this.theme),
      link: linkConverterFactory(this.theme, {
        addFootNote: this.addFootNote,
        enableFootNote: true,
      }),
      list: listConverterFactory(this.theme),
      listitem: listItemConverterFactory(this.theme),
      paragraph: paragraphConverterFactory(this.theme),
      blockquote: quoteConverterFactory(this.theme),
      strong: strongConverterFactory(this.theme),
      code: codeConverterFactory(this.theme),
      codespan: codeSpanConverterFactory(this.theme),
    };
  }
}

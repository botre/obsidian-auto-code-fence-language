import { Editor, MarkdownView, Plugin, TFile } from "obsidian";
// @ts-expect-error: Cannot find module
import { GuessLang } from "@ray-d-song/guesslang-js";

interface CodeFence {
  content: string;
  language: string;
  startLine: number;
  endLine: number;
}

export default class AutoCodeFenceLanguagePlugin extends Plugin {
  private guessLang: GuessLang | null = null;

  async onload() {
    this.guessLang = new GuessLang();
    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        if (file instanceof TFile) {
          this.handleFileModify(file);
        }
      }),
    );
  }

  async handleFileModify(file: TFile) {
    if (file.extension !== "md") {
      return;
    }

    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView || activeView.file !== file) {
      return;
    }

    const editor = activeView.editor;
    await this.processCodeFences(editor);
  }

  async processCodeFences(editor: Editor) {
    const content = editor.getValue();
    const fences = this.extractCodeFences(content);
    for (const fence of fences) {
      if (fence.content.trim() && !fence.language) {
        const detectedLanguage = await this.detectLanguage(fence.content);
        if (detectedLanguage) {
          this.updateFenceLanguage(editor, fence.startLine, detectedLanguage);
        }
      }
    }
  }

  extractCodeFences(content: string): CodeFence[] {
    const fences: CodeFence[] = [];
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("```")) {
        const language = lines[i].substring(3).trim();
        const fenceContent: string[] = [];
        const startLine = i;
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].startsWith("```")) {
            fences.push({
              content: fenceContent.join("\n"),
              language: language,
              startLine: startLine,
              endLine: j,
            });
            i = j;
            break;
          }
          fenceContent.push(lines[j]);
        }
      }
    }

    return fences;
  }

  async detectLanguage(content: string): Promise<string | null> {
    if (!this.guessLang) {
      return null;
    }
    try {
      const predictions = await this.guessLang.runModel(content);
      const [bestPrediction] = predictions;
      if (!bestPrediction) {
        return null;
      }
      if (bestPrediction.confidence < 0.2) {
        return null;
      }
      return bestPrediction.languageId;
    } catch (error) {
      return null;
    }
  }

  updateFenceLanguage(editor: Editor, startLine: number, language: string) {
    const newLine = `\`\`\`${language}`;
    editor.setLine(startLine, newLine);
  }
}

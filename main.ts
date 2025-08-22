import { Editor, MarkdownView, Plugin, TFile } from "obsidian";
import { Magika } from "magika";
import type { MagikaResult } from "magika/src/magika-result";

interface CodeFence {
  content: string;
  language: string;
  startLine: number;
  endLine: number;
}

export default class AutoCodeFenceLanguagePlugin extends Plugin {
  private magika: Magika | null = null;

  async onload() {
    console.log("Loading Magika...");
    this.magika = await Magika.create();
    console.log("Magika loaded");
    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        console.log("File modified:", file.path);
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
    if (!this.magika) {
      return null;
    }
    try {
      const fileBytes = new TextEncoder().encode(content);
      const prediction = await this.magika.identifyBytes(fileBytes);
      return this.mapMagikaToLanguage(prediction);
    } catch (error) {
      return null;
    }
  }

  private supportedLanguages = [
    "bash",
    "c",
    "cpp",
    "csharp",
    "css",
    "go",
    "html",
    "java",
    "javascript",
    "json",
    "markdown",
    "php",
    "python",
    "ruby",
    "rust",
    "shell",
    "sql",
    "typescript",
    "xml",
    "yaml",
  ];

  mapMagikaToLanguage(result: MagikaResult): string | null {
    const prediction = result.prediction;
    const magikaLabel = prediction.dl.label;
    if (!magikaLabel) return null;

    const detectedLanguage = magikaLabel.toLowerCase();
    return this.supportedLanguages.includes(detectedLanguage)
      ? detectedLanguage
      : null;
  }

  updateFenceLanguage(editor: Editor, startLine: number, language: string) {
    const newLine = `\`\`\`${language}`;
    editor.setLine(startLine, newLine);
  }
}

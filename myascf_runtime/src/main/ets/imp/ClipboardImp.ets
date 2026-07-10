import { pasteboard } from '@kit.BasicServicesKit';

export class ClipboardImp {
  async writeText(text: string): Promise<void> {
    const data = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, text);
    await pasteboard.getSystemPasteboard().setData(data);
  }

  async readText(): Promise<string> {
    const data = await pasteboard.getSystemPasteboard().getData();
    const text: string = data.getPrimaryText();
    return text;
  }
}

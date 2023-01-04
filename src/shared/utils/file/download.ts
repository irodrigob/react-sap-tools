export default class DownloadFile {
  static download(fileType: string, filename: string, content: string): void {
    const blob = new Blob([content], { type: fileType });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.download = filename;
    link.href = url;
    link.click();
  }
}

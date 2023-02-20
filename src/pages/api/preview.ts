export default function preview(req: any, res: any) {
  res.setPreviewData({});
  res.writeHead(307, {Location: '/'});
  res.end();
}
export function getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream> {
  if (!process?.client || (navigator?.mediaDevices as unknown as any)?.getDisplayMedia == null)
    throw new Error('Device does not support getDisplayMedia')
  return (navigator.mediaDevices as unknown as any).getDisplayMedia(constraints)
}

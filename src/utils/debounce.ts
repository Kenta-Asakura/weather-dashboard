export function debounce<T extends (...args: any[]) => void>(
  cb: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args); 
    }, delay);
  };
}
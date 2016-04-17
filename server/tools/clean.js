import del from 'del';

export default async () => {
  await del(['dist/*'], { dot: true });
};

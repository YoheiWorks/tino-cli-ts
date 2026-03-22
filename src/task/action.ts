function handleAddTask(title: string, description?: string) {
  console.log(`Task ${title} を追加します。`);
  if (description) {
    console.log(`Description: ${description}`);
  }
}

export { handleAddTask };
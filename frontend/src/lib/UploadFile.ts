function triggerFilePicker() {
  document.getElementById('navbarFileInput')?.click()
}

function handleFileUpload(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  const file = files[0]
  const reader = new FileReader()
  reader.onload = () => {
    const imgSrc = reader.result as string
    // Add as a separate node (no backlinks)
    canvasRef.value?.addNewNode?.('Uploaded Image', [], 300, 300, imgSrc)
  }
  reader.readAsDataURL(file)
}
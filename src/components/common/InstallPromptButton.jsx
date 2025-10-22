import useAddToHomePrompt from "../hooks/useAddToHomePrompt";

export default function InstallPromptButton() {
  const { promptInstall, isInstalled } = useAddToHomePrompt();

  const handleClick = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      console.log("User accepted installation");
    } else {
      console.log("User dismissed installation");
    }
  };

  if (isInstalled) return null; // Hide if already installed

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Install App
    </button>
  );
}

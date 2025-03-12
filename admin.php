<?php
$sections = ["summary", "about", "contact", "business", "upcoming", "address", "email"];
$message = "";

// Define the subfolder for text files
$folder = "textfiles";

// Ensure the folder exists
if (!is_dir($folder)) {
    mkdir($folder, 0777, true); // Create folder if it doesn't exist
}

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $section = $_POST["section"];
    $content = htmlspecialchars($_POST["content"], ENT_QUOTES, 'UTF-8');

    $filePath = "$folder/$section.txt"; // Update file path

    if (in_array($section, $sections)) {
        if (file_put_contents($filePath, $content) !== false) {
            $message = "Updated successfully!";
        } else {
            $message = "Error: Could not write to file!";
        }
    } else {
        $message = "Invalid section!";
    }
}

// Load current content for preview
$currentContent = [];
foreach ($sections as $section) {
    $filePath = "$folder/$section.txt"; // Update file path
    $currentContent[$section] = file_exists($filePath) ? file_get_contents($filePath) : "";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    <link rel="stylesheet" href="styles/admin.css">
</head>
<body>
    <div class="container">
        <h2>Admin Panel - Edit Website Content</h2>
        <p class="message"><?php echo htmlspecialchars($message); ?></p>

        <form method="POST">
            <label for="section">Select Section:</label>
            <select name="section" id="section">
                <?php foreach ($sections as $sec): ?>
                    <option value="<?php echo htmlspecialchars($sec); ?>"><?php echo ucfirst(htmlspecialchars($sec)); ?></option>
                <?php endforeach; ?>
            </select>

            <textarea name="content" id="content"></textarea>
            <button type="submit">Save</button>
        </form>
    </div>
    
    <script src="scripts/adminpanel.js"></script>
</body>
</html>
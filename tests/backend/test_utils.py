from backend.utils.utils import sanitize_title, generate_filename

def test_sanitize_title():
    # Test that illegal characters are removed
    assert sanitize_title("My | Awesome <Video> :?") == "My  Awesome Video "
    assert sanitize_title("Normal Title") == "Normal Title"
    assert sanitize_title('Title with "quotes" and /slashes\\') == "Title with quotes and slashes"

def test_generate_filename():
    title = "Test Video"
    filename = generate_filename(title)
    # Ensure it starts with the sanitized title
    assert filename.startswith("Test Video[GravityBlu][")
    # Ensure it ends with a closing bracket
    assert filename.endswith("]")

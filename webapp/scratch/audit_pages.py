import os
import re

WEBAPP_PAGES_DIR = r"c:\Users\EnigmaticWhisper\Projects\Startup\el_Moultaqa\webapp\src\pages"
ADMIN_PAGES_DIR = r"c:\Users\EnigmaticWhisper\Projects\Startup\el_Moultaqa\admin\src\pages"

def audit_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Find imports of backend or localService
    has_backend_import = "backend" in content or "localService" in content or "fetch" in content or "queryOrgTable" in content
    
    # Check for localstorage usage
    has_localstorage = "localStorage" in content
    
    # Check for hardcoded mockup lists
    # Find any array definitions containing mock keywords like 'john doe', 'sample', 'test speaker', etc.
    mock_keywords = ["sample", "test", "mock", "dummy", "placeholder", "jane doe", "john doe"]
    found_mock_keywords = [kw for kw in mock_keywords if kw in content.lower()]
    
    # Find inline arrays
    # Matches patterns like const name = [ { ... } ]
    array_defs = re.findall(r"(?:const|let|var)\s+\w+\s*=\s*\[\s*\{", content)
    
    return {
        "filepath": filepath,
        "has_backend_import": has_backend_import,
        "has_localstorage": has_localstorage,
        "found_mock_keywords": found_mock_keywords,
        "array_defs_count": len(array_defs),
        "lines": len(content.splitlines())
    }

def run_audit():
    print("=== STARTING FULL PAGES DATABASE LINK AUDIT ===")
    
    print("\n--- Auditing Webapp Pages ---")
    for filename in os.listdir(WEBAPP_PAGES_DIR):
        if filename.endswith(".jsx") or filename.endswith(".js"):
            res = audit_file(os.path.join(WEBAPP_PAGES_DIR, filename))
            print(f"File: {filename} ({res['lines']} lines)")
            print(f"  - Database Connected: {res['has_backend_import']}")
            print(f"  - LocalStorage direct calls: {res['has_localstorage']}")
            print(f"  - Mock Keywords found: {res['found_mock_keywords']}")
            print(f"  - Array structure definitions: {res['array_defs_count']}")
            
    print("\n--- Auditing Admin Pages ---")
    for filename in os.listdir(ADMIN_PAGES_DIR):
        if filename.endswith(".jsx") or filename.endswith(".js"):
            res = audit_file(os.path.join(ADMIN_PAGES_DIR, filename))
            print(f"File: {filename} ({res['lines']} lines)")
            print(f"  - Database Connected: {res['has_backend_import']}")
            print(f"  - LocalStorage direct calls: {res['has_localstorage']}")
            print(f"  - Mock Keywords found: {res['found_mock_keywords']}")
            print(f"  - Array structure definitions: {res['array_defs_count']}")

if __name__ == "__main__":
    run_audit()

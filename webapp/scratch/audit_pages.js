const fs = require('fs');
const path = require('path');

const WEBAPP_PAGES_DIR = "c:\\Users\\EnigmaticWhisper\\Projects\\Startup\\el_Moultaqa\\webapp\\src\\pages";
const ADMIN_PAGES_DIR = "c:\\Users\\EnigmaticWhisper\\Projects\\Startup\\el_Moultaqa\\admin\\src\\pages";

function auditFile(filepath) {
    const content = fs.readFileSync(filepath, 'utf8');

    // Find imports of backend or localService
    const hasBackendImport = content.includes('backend') || 
                             content.includes('localService') || 
                             content.includes('fetch') || 
                             content.includes('queryOrgTable');
    
    // Check for localstorage usage
    const hasLocalstorage = content.includes('localStorage');
    
    // Check for mock keywords
    const mockKeywords = ["sample", "test", "mock", "dummy", "placeholder", "jane doe", "john doe"];
    const foundMockKeywords = mockKeywords.filter(kw => content.toLowerCase().includes(kw));
    
    // Find array definitions containing objects: e.g. const someVar = [ {
    const arrayDefsCount = (content.match(/(const|let|var)\s+\w+\s*=\s*\[\s*\{/g) || []).length;
    
    return {
        filepath,
        hasBackendImport,
        hasLocalstorage,
        foundMockKeywords,
        arrayDefsCount,
        lines: content.split('\n').length
    };
}

function runAudit() {
    console.log("=== STARTING FULL PAGES DATABASE LINK AUDIT ===");
    
    console.log("\n--- Auditing Webapp Pages ---");
    fs.readdirSync(WEBAPP_PAGES_DIR).forEach(filename => {
        if (filename.endsWith('.jsx') || filename.endsWith('.js')) {
            const res = auditFile(path.join(WEBAPP_PAGES_DIR, filename));
            console.log(`File: ${filename} (${res.lines} lines)`);
            console.log(`  - Database Connected: ${res.hasBackendImport}`);
            console.log(`  - LocalStorage direct calls: ${res.hasLocalstorage}`);
            console.log(`  - Mock Keywords found: [${res.foundMockKeywords.join(', ')}]`);
            console.log(`  - Array structure definitions: ${res.arrayDefsCount}`);
        }
    });
            
    console.log("\n--- Auditing Admin Pages ---");
    fs.readdirSync(ADMIN_PAGES_DIR).forEach(filename => {
        if (filename.endsWith('.jsx') || filename.endsWith('.js')) {
            const res = auditFile(path.join(ADMIN_PAGES_DIR, filename));
            console.log(`File: ${filename} (${res.lines} lines)`);
            console.log(`  - Database Connected: ${res.hasBackendImport}`);
            console.log(`  - LocalStorage direct calls: ${res.hasLocalstorage}`);
            console.log(`  - Mock Keywords found: [${res.foundMockKeywords.join(', ')}]`);
            console.log(`  - Array structure definitions: ${res.arrayDefsCount}`);
        }
    });
}

runAudit();

# PowerShell script to update all registration screens with the new header component

$registrationFiles = @(
    "AdditionalInfoScreen.tsx",
    "ChildInfoScreen.tsx", 
    "EvacuationCenterScreen.tsx",
    "EvacuationDetailsScreen.tsx",
    "FinalRemindersScreen.tsx",
    "GeneralVerificationScreen.tsx",
    "HouseholdInfoScreen.tsx",
    "HouseholdScanScreen.tsx", 
    "LocationDetailsScreen.tsx",
    "OTPScreen.tsx",
    "ParentalConsentScreen.tsx",
    "ParentInfoScreen.tsx",
    "ParentVerificationScreen.tsx",
    "PWDVerificationScreen.tsx",
    "SeniorVerificationScreen.tsx",
    "VerificationSuccessScreen.tsx",
    "AccountSetupScreen.tsx"
)

$basePath = "c:\Development\Emma\emmafrontend\screens\registration"

foreach ($file in $registrationFiles) {
    $fullPath = Join-Path $basePath $file
    
    if (Test-Path $fullPath) {
        Write-Host "Processing $file..."
        
        $content = Get-Content $fullPath -Raw
        
        # Skip if already processed (contains RegistrationHeader)
        if ($content -match "RegistrationHeader") {
            Write-Host "$file already updated, skipping..."
            continue
        }
        
        # Add import for RegistrationHeader
        $content = $content -replace 'import { LinearGradient } from "expo-linear-gradient"', ''
        $content = $content -replace '(import.*commonStyles.*\n)', '$1import RegistrationHeader from "../../components/screen_components/RegistrationHeader"' + "`n"
        
        # Replace LinearGradient wrapper with new structure
        $content = $content -replace '<LinearGradient colors=\{\[colors\.gradientStart, colors\.gradientEnd\]\} style=\{commonStyles\.mainThemeBackground\}>', '<View style={styles.container}>'
        $content = $content -replace '</LinearGradient>', '</View>'
        
        # Replace old container and back button structure
        $content = $content -replace '<View style=\{commonStyles\.container\}>\s*<TouchableOpacity style=\{commonStyles\.backButton\} onPress=\{\(\) => navigation\.goBack\(\)\}>\s*<Text style=\{commonStyles\.backButtonText\}>← (.*?)</Text>\s*</TouchableOpacity>\s*<View style=\{commonStyles\.whiteContainer\}>', @"
      <RegistrationHeader 
        title="`$1" 
        onBackPress={() => navigation.goBack()}
      />
      
      <View style={commonStyles.whiteContainerWithHeader}>
"@
        
        # Add container style if not present
        if ($content -notmatch 'const styles.*=.*StyleSheet\.create') {
            $content = $content -replace '}\s*export default', @"
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.gradientStart,
  },
};

export default
"@
        } else {
            # Add container style to existing StyleSheet
            $content = $content -replace '(const styles = StyleSheet\.create\(\{)', '$1' + "`n  container: {`n    flex: 1,`n    backgroundColor: colors.gradientStart,`n  },"
        }
        
        Set-Content $fullPath $content
        Write-Host "$file updated successfully!"
    } else {
        Write-Host "$file not found, skipping..."
    }
}

Write-Host "All registration screens have been processed!"

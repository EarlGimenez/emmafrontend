import { StyleSheet } from "react-native"

export const colors = {
  primary: "#154257",
  secondary: "#17A2B8",
  fieldBg: "#D9D9D9",
  white: "#FFFFFF",
  gradientStart: "#1E78AD", // Blue
  gradientEnd: "#0C3147", // Dark Blue
}

export const commonStyles = StyleSheet.create({
  mainThemeBackground: {
    flex: 1,
    backgroundColor: colors.gradientStart,
  },
  container: {
    flex: 1,
  },
  whiteContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flex: 1,
    marginTop: "10%", // 80% of the view
    paddingTop: 20,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 30,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: 15,
  },
  fieldContainer: {
    marginBottom: 20,
    width: 300,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: colors.fieldBg,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    marginBottom: 10
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    maxHeight: 50,
    justifyContent: "center",
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    maxHeight: 40,
    justifyContent: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "Alternates",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 20,
  },
  backArrow: {
    fontSize: 40,
    color: colors.white,
    fontWeight: "bold",
  },
  bottomButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    marginHorizontal: 20,
  },
  centeredContent: {
    alignItems: "center",
    paddingHorizontal: 20,

  },
})

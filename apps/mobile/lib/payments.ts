import { Platform } from "react-native";
import Purchases from "react-native-purchases";

const entitlement = process.env.EXPO_PUBLIC_REVENUECAT_PRO_ENTITLEMENT ?? "pro";
let configured = false;
let currentUserId: string | null = null;

function apiKey(): string {
  const key =
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
      : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
  if (!key) throw new Error(`RevenueCat is not configured for ${Platform.OS}.`);
  return key;
}

export async function configurePayments(userId: string): Promise<boolean> {
  if (!configured) {
    Purchases.configure({ apiKey: apiKey(), appUserID: userId });
    configured = true;
    currentUserId = userId;
  } else if (currentUserId !== userId) {
    await Purchases.logIn(userId);
    currentUserId = userId;
  }
  return refreshProStatus();
}

export async function refreshProStatus(): Promise<boolean> {
  if (!configured) return false;
  const customer = await Purchases.getCustomerInfo();
  return Boolean(customer.entitlements.active[entitlement]);
}

export async function purchasePro(): Promise<boolean> {
  if (!configured) throw new Error("Sign in before purchasing Fitnexx Pro.");
  const offering = (await Purchases.getOfferings()).current;
  const pack = offering?.availablePackages[0];
  if (!pack)
    throw new Error("The Fitnexx Pro subscription is not available yet.");
  const { customerInfo } = await Purchases.purchasePackage(pack);
  return Boolean(customerInfo.entitlements.active[entitlement]);
}

export async function restorePro(): Promise<boolean> {
  if (!configured) throw new Error("Sign in before restoring purchases.");
  const customer = await Purchases.restorePurchases();
  return Boolean(customer.entitlements.active[entitlement]);
}

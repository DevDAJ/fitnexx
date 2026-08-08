import { Platform } from "react-native";
import {
  AdEventType,
  MobileAds,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
      android: "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY",
      ios: "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY",
    });

export function initializeAds(): void {
  MobileAds().initialize().catch(() => {});
}

export function watchRewardedAd(): Promise<boolean> {
  if (!REWARDED_AD_UNIT_ID) return Promise.resolve(false);
  return new Promise((resolve) => {
    let settled = false;
    const done = (earned: boolean) => {
      if (settled) return;
      settled = true;
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeError();
      unsubscribeClosed();
      resolve(earned);
    };

    const ad = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      ad.show();
    });
    const unsubscribeEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      done(true);
    });
    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, () => {
      done(false);
    });
    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      done(false);
    });

    ad.load();
  });
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { setPersistenceStorage } from "@fitnexx/shared/src/stores/persistence";

setPersistenceStorage({
  getItem: AsyncStorage.getItem,
  setItem: AsyncStorage.setItem,
  removeItem: AsyncStorage.removeItem,
});

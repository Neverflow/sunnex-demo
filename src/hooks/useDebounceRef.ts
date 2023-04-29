import { Ref, ref, unref, watch, watchEffect } from "vue";

export const useDebounceRef = <T>(refValue: Ref<T>, delay = 100) => {
  const value = unref(refValue);
  const debouncedRef = ref<T>(value);
  let timeoutId: number;

  function updateRefValue() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      (debouncedRef as Ref<T>).value = refValue.value;
    }, delay);
  }

  watch(refValue, () => {
    updateRefValue();
  });

  return debouncedRef as Ref<T>;
};

<template>
  <p v-if="errorText" class="ml-2 text-red-500">{{ errorText }}</p>
</template>

<script lang="ts">
export default {
  name: "ValidationErrorText",
  props: {
    errorText: {
      type: String,
      required: true,
      default: "",
    },
  },
};
</script>

<style></style>

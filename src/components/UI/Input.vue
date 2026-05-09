<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-semibold text-gray-700 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="[
        'block w-full px-3 py-2 text-black placeholder:text-gray-400 transition duration-100 ease-in-out',
        'bg-white border border-gray-300 rounded',
        'focus:border-brand-500 focus:ring-2 focus:ring-brand-400 focus:outline-none focus:ring-opacity-40',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error &&
          'border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-50'
      ]"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-if="hint && !error" class="mt-1 text-xs text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup>
defineProps({
  id: String,
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  modelValue: [String, Number],
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  hint: String
})

defineEmits(['update:modelValue'])
</script>


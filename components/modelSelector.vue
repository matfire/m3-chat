<script lang="ts" setup>
    import {availableModels} from "~/lib/models"
    const emit = defineEmits<{
        selectModel: [value: string]
    }>()

    const handleChange = (value:string | null) => {
        if (!value) return
        emit("selectModel", value)
    }
</script>

<template>
    <Select @update:model-value="(v) => handleChange(v?.toString() ?? null)">
        <SelectTrigger>
            <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup v-for="category, categoryName in availableModels">
                <SelectLabel>{{categoryName}}</SelectLabel>
                <SelectItem v-for="modelId, modelValue in category" :value="modelId">
                    {{modelValue}}
                </SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
</template>
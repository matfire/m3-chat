<script lang="ts" setup>

    const {data} = await useFetch("/api/providers/all")
    const emit = defineEmits<{
        selectModel: [modelProvider:string, modelId: string]
    }>()

    const handleChange = (value:string | null) => {
        if (!value) return
        const [provider, modelId] = value.split("___")
        emit("selectModel", provider, modelId)
    }
</script>

<template>
    <Select @update:model-value="(v) => handleChange(v?.toString() ?? null)">
        <SelectTrigger>
            <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup v-for="provider in data">
                <SelectLabel>{{ provider.provider }}</SelectLabel>
                <SelectItem v-for="model in provider.models" :value="`${provider.provider}___${model.id}`">
                    {{ model.name }}
                </SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
</template>
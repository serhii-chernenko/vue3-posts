<script setup lang="ts">
import { usePostStore } from '@/stores/PostStore'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLoader from '@/components/AppLoader.vue'
const route = useRoute()

const postStore = usePostStore()

const id = Number(route.params.id as string)

if (!id) {
    throw new Error('Post ID is required')
}

postStore.fetchPostSingle({ id })

const post = computed(() => postStore.post)
</script>
<template>
    <AppLoader v-if="postStore.loadingSingle && !post" />
    <div v-if="post">
        <h1 class="text-3xl">
            {{ post?.title }}
            <AppLoader v-if="postStore.loadingSingle" size="sm" />
        </h1>
        <p>
            {{ new Date(post?.publishedAt).toLocaleDateString() }}
            {{ new Date(post?.publishedAt).toLocaleTimeString() }}
        </p>
        <p class="mb-5 opacity-50">{{ post?.previewSnippet }}</p>
        <div v-if="post?.body">
            <p>{{ post?.body }}</p>
        </div>
        <div v-else>
            <div class="w-3/4 h-4 mb-2 skeleton"></div>
            <div class="w-full h-4 mb-2 skeleton"></div>
            <div class="w-full h-4 mb-2 skeleton"></div>
        </div>
    </div>
</template>

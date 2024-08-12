import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Post } from '@/types'
import { useCachedFetch } from '@/composables/useCachedFetch'

export const usePostStore = defineStore('PostStore', () => {
    const posts = ref<Post[]>()
    const loadingList = ref(false)
    async function fetchPostList() {
        const { loading, doFetch } = useCachedFetch({
            data: posts,
            fetchStrategy: 'stale-refresh-bg',
        })

        watch(loading, (loading) => {
            loadingList.value = loading
        })

        await doFetch('/api/posts?fields=id,title,previewSnippet')
    }

    const loadingSingle = ref(false)
    const post = ref<Post>()

    const route = useRoute()
    async function fetchPostSingle() {
        const { id } = route.params

        if (!id) {
            return
        }

        const { loading, doFetch } = useCachedFetch({
            data: post,
            fetchStrategy: 'stale-refresh-bg',
        })

        if (!post.value && posts.value?.length) {
            loadingList.value = true

            const foundPost = posts.value.find(
                (p) => p.id === parseInt(id as string),
            )

            if (!foundPost) {
                return
            }

            post.value = foundPost
        }

        watch(loading, (loading) => {
            loadingList.value = loading
        })

        await doFetch(`/api/posts/${id}`)
    }

    return {
        // list of posts
        loadingList,
        posts,
        fetchPostList,

        // single post
        fetchPostSingle,
        loadingSingle,
        post,
    }
})

// @ts-ignore
if (import.meta.hot) {
    // @ts-ignore
    import.meta.hot.accept(acceptHMRUpdate(usePostStore, import.meta.hot))
}

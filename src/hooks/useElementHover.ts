import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useElementHover(elementRef: Ref<HTMLElement | undefined>) {
  const isHover = ref(false)

  const handleMouseEnter = () => {
    isHover.value = true
  }

  const handleMouseLeave = () => {
    isHover.value = false
  }

  onMounted(() => {
    const element = elementRef.value
    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter)
      element.addEventListener('mouseleave', handleMouseLeave)
    }
  })

  onUnmounted(() => {
    const element = elementRef.value
    if (element) {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  })

  return isHover
}

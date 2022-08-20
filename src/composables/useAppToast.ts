import { useToast } from 'primevue/usetoast'

export const useAppToast = () => {
  const toast = useToast()

  const success = (message: string) => {
    toast.add({ severity: 'success', summary: message, life: 3000 })
  }

  const thrown = (err: unknown) => {
    console.error(err)
    toast.add({
      severity: 'error',
      summary: 'エラーが発生しました。',
      detail: String(err),
      life: undefined,
    })
  }

  return {
    success,
    thrown,
  }
}

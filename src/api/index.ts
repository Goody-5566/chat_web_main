import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function getData<T>( data:T ) {
  console.log('data:',data);
  return post<T>({
    url: '/chat/queryaction',
    headers: { 'Authorization':'Bearer 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' },
		data: {
          "model": "gpt-3.5-turbo",
          "messages": [{"role": "user", "content": "123"} ],
          "temperature": 0.7
    }
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    model: "gpt-3.5-turbo",
		messages: [{"role": "user", "content": params.prompt} ],
		temperature: 0.7
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }


let url: string = "";
if(params.prompt.includes("自有知识库：")){
  url = `/chat/queryaction?type=0&query=${params.prompt}`
  params.prompt = params.prompt.slice(6)
  data.messages[0].content = data.messages[0].content.slice(6)
}else if(params.prompt.includes("外部API：")){
  url = `/chat/queryaction?type=1&query=${params.prompt}`
  params.prompt = params.prompt.slice(6)
  data.messages[0].content = data.messages[0].content.slice(6)
}else if(params.prompt.includes("默认AI：")){
  params.prompt = params.prompt.slice(5)
  data.messages[0].content = data.messages[0].content.slice(5)
  url = '/v1/chat/completions'
} else {
	url = '/v1/chat/completions'
}

return post<T>({
  url: url,
  headers: { 'Authorization':'Bearer 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' },
  data,
  signal: params.signal,
  onDownloadProgress: params.onDownloadProgress,
})
}



export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

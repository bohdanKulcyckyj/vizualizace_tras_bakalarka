import { setHeadersConfig } from './axiosWithAuth'
import apiEndpoints from '../constants/apiEndpoints'
import axios, { AxiosResponse } from 'axios'

export interface IHandleFileUploadOptions {
  allowedFormats: string[]
  allowedSizeInMB: number
}

export interface IHandleFileUploadParams {
  file: File
  options: IHandleFileUploadOptions
}

export const handleFileUpload = ({
  file,
  options,
}: IHandleFileUploadParams): Promise<AxiosResponse> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file selected')
      return
    }

    if (
      options.allowedFormats.length > 0 &&
      !options.allowedFormats.includes(file.type)
    ) {
      reject('File format is not allowed')
      return
    }

    if (
      options.allowedSizeInMB > 0 &&
      file.size / 1024 / 1024 >= options.allowedSizeInMB
    ) {
      reject('File is too big')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    const requestConfig = setHeadersConfig({
      'Content-Type': 'multipart/form-data',
    })
    axios
      .post(apiEndpoints.uploadMedia, formData, requestConfig)
      .then((response: AxiosResponse) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

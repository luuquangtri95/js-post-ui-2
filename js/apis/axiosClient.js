// create new instance

import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    // console.log('request intercepter', config)

    // attach token to request if exists
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    // console.log('response config', response.data)

    return response.data
  },
  function (error) {
    console.log('axios client error', error.response)
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    // !handle common errors
    if (!error.response) throw new Error('network error, please try again later')

    // redirect to login page if not login
    if (error.response.status === 401) {
      window.location.assign('/login')
    }
    return Promise.reject(error)
  }
)

export default axiosClient

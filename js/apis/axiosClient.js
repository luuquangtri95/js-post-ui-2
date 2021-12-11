// create new instance

import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://js-post.herokuapp.com',
  headers: {
    'Content-Type': 'Application/json',
  },
})

export default axiosClient

import axiosClient from './apis/axiosClient'
import postApi from './apis/postApi'

async function main() {
  const queryParams = {
    _page: 1,
    _limit: 5,
  }

  const res = await postApi.getAll(queryParams)
  console.log(res)
}

main()

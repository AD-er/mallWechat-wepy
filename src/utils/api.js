import wepy from 'wepy'

const host = 'https://'
const origin_host = 'https://'

// 普通请求
const request = async (options, showLoading = true) => {
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  // 显示加载中
  if (showLoading) {
    wepy.showLoading({title: '加载中'})
  }
  // 拼接请求地址
  options.url = host + '/' + options.url
  // 调用小程序的 request 方法
  let response = await wepy.request(options)

  if (showLoading) {
  // 隐藏加载中
    wepy.hideLoading()
  }

  // 服务器异常后给与提示
  if (response.statusCode === 500) {
    wepy.showModal({
      title: '提示',
      content: '服务器错误，请联系管理员或重试'
    })
  }
  return response
}

// 登录认证
const login = async (params = {}) => {
  // code 只能使用一次，所以每次单独调用
  // let loginData = await wepy.login()

  // 参数中增加code
  // params.code = loginData.code

  // 接口请求 authorizations
  let authResponse = await request({
    url: 'authorizations',
    data: params,
    method: 'POST'
  })

  // 登录成功，记录 token 信息保存在 storage 中
  if (authResponse.statusCode === 201) {
    wepy.setStorageSync('access_token', authResponse.data.access_token)
    wepy.setStorageSync('access_token_expired_at', new Date().getTime() + authResponse.data.expires_in * 1000)
  }

  return authResponse
}

// 刷新 Token
const refreshToken = async (accessToken) => {
  // 请求刷新接口
  let refreshResponse = await wepy.request({
    url: host + '/' + 'authorizations/current',
    method: 'PUT',
    header: {
      'Authorization': 'Bearer ' + accessToken
    }
  })

  // 刷新成功状态码为 200
  if (refreshResponse.statusCode === 200) {
    // 将 Token 及过期时间保存在 storage 中
    wepy.setStorageSync('access_token', refreshResponse.data.access_token)
    wepy.setStorageSync('access_token_expired_at', new Date().getTime() + refreshResponse.data.expires_in * 1000)
  }

  return refreshResponse
}

// 获取 Token
const getToken = async (options) => {
  // 从本地存储中取出 Token
  let accessToken = wepy.getStorageSync('access_token')
  let expiredAt = wepy.getStorageSync('access_token_expired_at')

  // 如果 token 过期了，则调用刷新方法
  if (accessToken && new Date().getTime() > expiredAt) {
    let refreshResponse = await refreshToken(accessToken)

    // 刷新成功
    if (refreshResponse.statusCode === 200) {
      accessToken = refreshResponse.data.access_token
    } else {
      // 刷新失败了，重新调用登录方法，设置 Token
      let authResponse = await login()
      if (authResponse.statusCode === 201) {
        accessToken = authResponse.data.access_token
      }
    }
  }

  return accessToken
}

// 带身份认证的请求
const authRequest = async (options, showLoading = true) => {
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  // 获取Token
  let accessToken = await getToken()

  // 将 Token 设置在 header 中
  let header = options.header || {}
  header.Authorization = 'Bearer ' + accessToken
  options.header = header

  return request(options, showLoading)
}

//  退出登录
const logout = async (params = {}) => {
  // let accessToken = wepy.getStorageSync('access_token')
  let accessToken = await getToken()
  // 调用删除 Token 接口，让 Token 失效
  let logoutResponse = await wepy.request({
    url: host + '/' + 'authorizations/current',
    method: 'DELETE',
    header: {
      'Authorization': 'Bearer ' + accessToken
    }
  })

  // 调用接口成功则清空缓存
  if (logoutResponse.statusCode === 204) {
    wepy.clearStorage()
  }

  return logoutResponse
}

const updateFile = async (options = {}) => {
  // 显示loading
  wepy.showLoading({title: '上传中'})

  // 获取 token
  let accessToken = await getToken()

  // 拼接url
  options.url = host + '/' + options.url
  let header = options.header || {}
  // 将 token 设置在 header 中
  header.Authorization = 'Bearer ' + accessToken
  options.header = header

  // 上传文件
  let response = await wepy.uploadFile(options)

  // 隐藏 loading
  wepy.hideLoading()

  return response
}

const lackStatusText = (e, t, a, i, o) => {
  var n = ["", "待拿货", "拿货中", "缺货", "已拿货", "已拿货", "已拿货"],
    s = {
      title: n[e] || "",
      show: !0,
      imposed: !1,
      red: "",
      desc: ""
    };
  if (1 == e && 1 == o) switch (t) {
    case 0:
      s.title = n[e], s.show = !1, s.desc = "";
      break;
    case -2:
      s.desc = "", s.show = !1;
      break;
    case -1:
      s.title = "停止发货", s.red = "3", s.desc = "此商品频繁缺货，请找同款，如已确认档口有货，请联系客服", s.imposed = !0, s.tips = "缺货", s.hover = "此商品频繁缺货，停止拿货，建议找同款";
      break;
    case 1:
      switch (a) {
        case 1:
          s.title = "待拿货", s.show = !1, s.desc = "";
          break;
        case 2:
          s.title = "待拿货", s.title1 = "下午可能有货", s.show = !1, s.desc = "档口反馈下午有货，拿货员将于下午再次拿货，建议等待";
          break;
        case 3:
          var r = new Date(i),
            c = new Date;
          s.title = "待拿货", s.desc = "档口反馈明天到货，预计明天拿货", r.format("yyyyMMdd") == c.format("yyyyMMdd") ? (s.tips = "预计明天到货", s.hover = r.format("MM月dd日 hh:mm") + " 档口反馈明天到货") : s.show = !1;
          break;
        case 4:
          var r = new Date(i),
            c = new Date,
            l = new Date(r.getTime() + 1728e5);
          s.title = "待拿货", s.desc = "档口缺货且到货时间不确定，预计" + l.format("MM月dd日") + "拿货，如需尽快拿货请找同款", ~~c.format("yyyyMMdd") - ~~l.format("yyyyMMdd") <= 0 ? (s.tips = "到货时间不定", s.hover = r.format("MM月dd日 hh:mm") + " 档口反馈到货时间不确定") : s.show = !1
      }
      break;
    case 2:
      s.title = "停止发货", s.red = "3", s.title1 = "商品未出货", s.desc = "档口反馈商品未出货，请找同款";
      break;
    case 3:
      s.title = "停止发货", s.red = "3", s.title1 = "商品已下架", s.desc = "档口商品已下架，请找同款";
      break;
    case 4:
      s.title = "停止发货", s.red = "3", s.title1 = "档口已涨价", s.desc = "档口反馈商品已涨价，请找同款";
      break;
    case 5:
      s.title = "停止发货", s.red = "3", s.title1 = "赠品不单独售卖", s.desc = "档口标记此商品为赠品（非卖品），请修改订单删除此商品";
      break;
    case 6:
      s.title = "质检不合格", s.desc = "该商品未通过质量检验环节，已为您安排换货";
      break;
    case 11:
      s.title = "", s.desc = "";
      break;
    case 12:
      s.title = "停止发货", s.red = "3", s.desc = "档口还未正式营业或地址有误，建议找同款，有疑问请联系客服", s.imposed = !0, s.tips = "停止发货", s.hover = "档口还未正式营业或地址有误，停止拿货，建议找同款";
      break;
    case 13:
      s.title = "停止发货", s.red = "3", s.desc = "档口疑似倒闭，建议找同款，有疑问请联系客服", s.imposed = !0, s.tips = "档口疑似倒闭", s.hover = "档口疑似倒闭，停止拿货，建议找同款";
      break;
    case 14:
      s.title = "停止发货", s.red = "3", s.tips = "缺货", s.hover = "档口反馈缺货，停止拿货，建议找同款", s.desc = "档口反馈缺货，建议找同款，有疑问请联系客服", s.imposed = !0;
      break;
    case 15:
      s.title = "停止发货", s.red = "3", s.desc = "商品暂不支持拿货，停止拿货，建议找同款", s.imposed = !0, s.tips = "停止拿货", s.hover = "商品暂不支持拿货，停止拿货，建议找同款"
  }
  return s
}

// 获取商品详情
const getItemInfo = async (id) => {
  // 显示加载中
  // if (showLoading) {
    // wepy.showLoading({title: '加载中'})
  // }
  // 拼接请求地址
  var options = {
    url: origin_host + '/item/' + id
  }
  // 调用小程序的 request 方法
  let response = await wepy.request(options)

  if (response.data.code === 200) {
    var attr =  response.data.data.item.attrs.split(",");
    var size = response.data.data.item.size.split(",");
    var color = response.data.data.item.color.split(",");
    var attrs = [];
    for (var i = 0; i < attr.length; i++) {
      attrs.push(attr[i].split(":"));
    }
    let itemInfo = {
      id: response.data.data.item.id,
      title: response.data.data.item.title,
      video_url: response.data.data.item.video_url,
      imgs: response.data.data.item.imgs.split(","),
      size: size,
      color: color,
      up_time: response.data.data.item.up_time.split(" "),
      size_id: response.data.data.item.size_id.split(","),
      color_id: response.data.data.item.color_id.split(","),
      size_able: Array(size.length).fill(true),
      color_able: Array(color.length).fill(true),
      index_img_url: response.data.data.item.index_img_url,
      discount_price: response.data.data.item.discount_price,
      skumap: JSON.parse(response.data.data.skumap),
      desc: response.data.data.item.desc,
      attrs: attrs
    }
    return itemInfo
  }


  // 隐藏加载中
  // if (showLoading) {
    // wepy.hideLoading()
  // }

  // 服务器异常后给与提示
  if (response.data.code === 500) {
    wepy.showModal({
      title: '提示',
      content: response.data.message
    })
  }
}

// 获取商品列表
const searchList = async (params) => {
  // 显示加载中
  // if (showLoading) {
    // wepy.showLoading({title: '加载中'})
  // }
  // 拼接请求地址
  var options = {
    url: origin_host + '/search/asy',
    data: params
  }
  // 调用小程序的 request 方法
  let response = await wepy.request(options)

  if (response.data.code === 200) {
    return response.data.data
  }


  // 隐藏加载中
  // if (showLoading) {
    // wepy.hideLoading()
  // }

  // 服务器异常后给与提示
  if (response.data.code === 500) {
    wepy.showModal({
      title: '提示',
      content: response.data.message
    })
  }
}

export default {
  request,
  authRequest,
  refreshToken,
  login,
  logout,
  updateFile,
  lackStatusText,
  getItemInfo,
  searchList
}
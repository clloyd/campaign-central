import {AuthedReqwest} from '../util/pandaReqwest';

export function fetchCampaigns() {
  return AuthedReqwest({
    url: '/api/campaigns',
    contentType: 'application/json',
    method: 'get'
  });
}

export function fetchCampaign(id) {
  return AuthedReqwest({
    url: '/api/campaigns/' + id,
    contentType: 'application/json',
    method: 'get'
  });
}

export function saveCampaign(id, campaign) {
  return AuthedReqwest({
    url: '/api/campaigns/' + id,
    data: JSON.stringify(campaign),
    contentType: 'application/json',
    method: 'put'
  });
}

export function createCampaign(campaign) {
  return AuthedReqwest({
    url: '/api/campaigns',
    data: JSON.stringify(campaign),
    contentType: 'application/json',
    method: 'post'
  });
}

export function fetchCampaignAnalytics(id) {
  return AuthedReqwest({
    url: '/api/campaigns/' + id + '/analytics',
    contentType: 'application/json',
    method: 'get'
  });
}

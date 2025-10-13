'use client'

import { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, Filter, Search, Eye } from 'lucide-react'

interface Review {
  id: string
  serviceId: string
  serviceName: string
  clientId: string
  clientName: string
  deliveryId?: string
  rating: number
  title: string
  comment: string
  qualityRating?: number
  timelinessRating?: number
  communicationRating?: number
  valueRating?: number
  isVerified: boolean
  isPublished: boolean
  response?: string
  respondedBy?: string
  respondedAt?: string
  helpfulCount: number
  notHelpfulCount: number
  createdAt: string
}

const mockReviews: Review[] = [
  {
    id: 'r1',
    serviceId: 's1',
    serviceName: 'ShopLeez POS',
    clientId: 'c1',
    clientName: 'TechCorp Inc.',
    deliveryId: 'd1',
    rating: 5,
    title: 'Excellent POS system with great support',
    comment: 'The implementation was smooth and the training was comprehensive. Our staff adapted quickly and we\'ve seen significant improvements in checkout speed. Highly recommended!',
    qualityRating: 5,
    timelinessRating: 5,
    communicationRating: 5,
    valueRating: 4,
    isVerified: true,
    isPublished: true,
    response: 'Thank you for the wonderful feedback! We\'re thrilled that your team is seeing improvements. We\'re always here to support you.',
    respondedBy: 'John Smith',
    respondedAt: '2024-02-16',
    helpfulCount: 12,
    notHelpfulCount: 0,
    createdAt: '2024-02-15'
  },
  {
    id: 'r2',
    serviceId: 's3',
    serviceName: 'Mobile Banking App',
    clientId: 'c2',
    clientName: 'FinanceHub',
    rating: 5,
    title: 'Outstanding mobile banking solution',
    comment: 'The security features are top-notch and the user experience is seamless. Our customers love the biometric authentication. Worth every penny.',
    qualityRating: 5,
    timelinessRating: 4,
    communicationRating: 5,
    valueRating: 5,
    isVerified: true,
    isPublished: true,
    response: 'We appreciate your trust in our security solutions. Looking forward to continued partnership!',
    respondedBy: 'Sarah Johnson',
    respondedAt: '2024-03-02',
    helpfulCount: 18,
    notHelpfulCount: 1,
    createdAt: '2024-03-01'
  },
  {
    id: 'r3',
    serviceId: 's4',
    serviceName: 'CRM System',
    clientId: 'c3',
    clientName: 'GlobalHR Solutions',
    deliveryId: 'd3',
    rating: 4,
    title: 'Solid CRM with room for improvement',
    comment: 'The system meets most of our needs and the automation features are great. However, the reporting could be more customizable. Overall a good investment.',
    qualityRating: 4,
    timelinessRating: 5,
    communicationRating: 4,
    valueRating: 4,
    isVerified: true,
    isPublished: true,
    response: 'Thank you for the honest feedback. We\'re working on enhanced reporting features in the next update!',
    respondedBy: 'Mike Chen',
    respondedAt: '2024-03-06',
    helpfulCount: 8,
    notHelpfulCount: 2,
    createdAt: '2024-03-05'
  },
  {
    id: 'r4',
    serviceId: 's2',
    serviceName: 'E-Commerce Platform',
    clientId: 'c4',
    clientName: 'RetailChain Pro',
    rating: 4,
    title: 'Feature-rich e-commerce solution',
    comment: 'Great platform with excellent marketing tools. The payment integration was straightforward. Customer support has been very responsive.',
    qualityRating: 4,
    timelinessRating: 4,
    communicationRating: 5,
    valueRating: 4,
    isVerified: true,
    isPublished: true,
    helpfulCount: 6,
    notHelpfulCount: 0,
    createdAt: '2024-02-28'
  },
  {
    id: 'r5',
    serviceId: 's5',
    serviceName: 'Restaurant Management',
    clientId: 'c5',
    clientName: 'Gourmet Bistro',
    rating: 5,
    title: 'Perfect for restaurant operations',
    comment: 'The table management and kitchen display features have transformed our operations. Staff love how intuitive it is. Best decision we made!',
    qualityRating: 5,
    timelinessRating: 5,
    communicationRating: 5,
    valueRating: 5,
    isVerified: true,
    isPublished: true,
    response: 'So glad to hear you\'re loving the system! Your success is our success.',
    respondedBy: 'Alex Rodriguez',
    respondedAt: '2024-03-04',
    helpfulCount: 14,
    notHelpfulCount: 0,
    createdAt: '2024-03-03'
  },
  {
    id: 'r6',
    serviceId: 's1',
    serviceName: 'ShopLeez POS',
    clientId: 'c6',
    clientName: 'Fashion Retail Co.',
    rating: 3,
    title: 'Good but has some limitations',
    comment: 'Works well for basic operations but we needed custom features for our fashion retail. Support team was helpful in finding workarounds.',
    qualityRating: 3,
    timelinessRating: 4,
    communicationRating: 4,
    valueRating: 3,
    isVerified: true,
    isPublished: true,
    response: 'We appreciate your feedback and understand your needs. Let\'s discuss custom solutions for your fashion retail requirements.',
    respondedBy: 'John Smith',
    respondedAt: '2024-03-08',
    helpfulCount: 3,
    notHelpfulCount: 1,
    createdAt: '2024-03-07'
  }
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRating, setFilterRating] = useState<string>('all')
  const [filterService, setFilterService] = useState<string>('all')

  const services = ['all', ...new Set(reviews.map(r => r.serviceName))]

  const stats = {
    total: reviews.length,
    avgRating: reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
    fiveStars: reviews.filter(r => r.rating === 5).length,
    fourStars: reviews.filter(r => r.rating === 4).length,
    threeStars: reviews.filter(r => r.rating === 3).length,
    twoStars: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length,
    verified: reviews.filter(r => r.isVerified).length,
    responseRate: (reviews.filter(r => r.response).length / reviews.length) * 100
  }

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating = filterRating === 'all' || r.rating === parseInt(filterRating)
    const matchesService = filterService === 'all' || r.serviceName === filterService
    return matchesSearch && matchesRating && matchesService
  })

  const renderStars = (rating: number, size: string = 'w-4 h-4') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Service Reviews</h1>
          <p className="text-gray-400">Client feedback and ratings</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-3 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-white mb-2">{stats.avgRating.toFixed(1)}</p>
            <div className="flex items-center justify-center mb-2">
              {renderStars(Math.round(stats.avgRating), 'w-5 h-5')}
            </div>
            <p className="text-sm text-gray-400">{stats.total} reviews</p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = rating === 5 ? stats.fiveStars : rating === 4 ? stats.fourStars : rating === 3 ? stats.threeStars : rating === 2 ? stats.twoStars : stats.oneStar
              const percentage = (count / stats.total) * 100

              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 w-8">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="col-span-9 grid grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stats.verified}</p>
            <p className="text-sm text-gray-400">Verified Reviews</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stats.responseRate.toFixed(0)}%</p>
            <p className="text-sm text-gray-400">Response Rate</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stats.fiveStars}</p>
            <p className="text-sm text-gray-400">5-Star Reviews</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            {services.map(service => (
              <option key={service} value={service}>
                {service === 'all' ? 'All Services' : service}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{review.title}</h3>
                  {review.isVerified && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mb-3">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-400">by {review.clientName}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-400">{review.serviceName}</span>
                </div>

                <p className="text-gray-300 mb-4">{review.comment}</p>

                {(review.qualityRating || review.timelinessRating || review.communicationRating || review.valueRating) && (
                  <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-900/50 rounded-lg">
                    {review.qualityRating && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Quality</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-white">{review.qualityRating}</span>
                        </div>
                      </div>
                    )}
                    {review.timelinessRating && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Timeliness</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-white">{review.timelinessRating}</span>
                        </div>
                      </div>
                    )}
                    {review.communicationRating && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Communication</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-white">{review.communicationRating}</span>
                        </div>
                      </div>
                    )}
                    {review.valueRating && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Value</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-white">{review.valueRating}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {review.response && (
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      <p className="text-sm font-medium text-purple-400">Response from {review.respondedBy}</p>
                      {review.respondedAt && (
                        <span className="text-xs text-gray-500">
                          • {new Date(review.respondedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{review.response}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700">
                  <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({review.helpfulCount})</span>
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                    <span>Not Helpful ({review.notHelpfulCount})</span>
                  </button>
                  {!review.response && (
                    <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm">
                      <MessageSquare className="w-4 h-4" />
                      Respond
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
          <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No reviews found matching your criteria</p>
        </div>
      )}
    </div>
  )
}

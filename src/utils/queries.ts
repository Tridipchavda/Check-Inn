export const loginQuery = `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            id
            name
            email
            role
          }
        }
      }
    `;

export const registerQuery = `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          token
          user {
            id
            name
            email
          }
        }
      }
    `;

export const getHotelsQuery = `
  query Hotels($filter: HotelFilterInput) {
    hotels(filter: $filter) {
      id
      name
      location
      rating
      images
      amenities
      rooms {
        price
      }
      reviews {
        id
        rating
        comment
        createdAt
        user {
          name
        }
      }
    }
  }
`;

export const bookRoomMutation = `
        mutation BookRoom($input: BookRoomInput!) {
          bookRoom(input: $input) {
            id
            status
            checkIn
            checkOut
          }
        }
      `

export const getHotelViewInfoQuery = `
      query GetHotelDetails($id: ID!) {
        hotel(id: $id) {
          id
          name
          location
          description
          rating
          images
          amenities
          rooms {
            id
            type
            price
            capacity
            roomNumber
            availability {
              date
              isAvailable
            }
          }
          reviews {
            id
            rating
            comment
            createdAt
            user {
              id
              name
            }
          }
        }
      }
`;

export const getAdminDashboardQuery = `
        query {
          users {
            id
          }
          hotels {
            id
          }
          bookings {
            id
            checkIn
            checkOut
            room {
              price
            }
          }
        }
      `;

export const deleteHotelMutation = `
      mutation DeleteHotel($id: ID!) {
        deleteHotel(id: $id)
      }
    `;

export const addHotelMutation = `
        mutation AddHotel($input: AddHotelInput!) {
          addHotel(input: $input) {
            id
            name
          }
        }
      `;

export const getBookingForAdminQuery = `
  query {
    bookings {
      id
      status
      checkIn
      checkOut
      guests
      user {
        name
        email
      }
      room {
        roomNumber
        type
        capacity
        price
        hotel {
          name
        }
      }
    }
  }
`;


export const getHotelByIdQuery = `
  query GetHotel($id: ID!) {
    hotel(id: $id) {
      id
      name
      location
      description
      images
      amenities
    }
  }
`;

export const updateHotelMutation = `
  mutation UpdateHotel($id: ID!, $input: AddHotelInput!) {
    updateHotel(id: $id, input: $input) {
      id
    }
  }
`;

export const approveBookingMutation = `
  mutation ApproveBooking($id: ID!) {
    approveBooking(id: $id) {
      id
      status
    }
  }
`;

export const addRoomMutation = `
  mutation AddRoom($input: AddRoomInput!) {
    addRoom(input: $input) {
      id
      roomNumber
      capacity
      price
      type
    }
  }
`;


export const getRoomsAvailabilityQuery = `
  query {
    rooms {
      id
      roomNumber
      type
      capacity
      price
      hotel {
        name
        id
      }
      availability {
        date
        isAvailable
      }
    }
  }
`;

export const addRoomAvailabilityMutation = `
  mutation SetRoomAvailability($input: SetAvailabilityInput!) {
    setRoomAvailability(input: $input) {
      date
      isAvailable
    }
  }
`;

export const leaveReviewMutation = `
  mutation leaveReview($input: ReviewInput!) {
    leaveReview(input: $input) {
      id
    }
  }
`;

export const getMyBookingsQuery = `
  query GetMyBookings {
    bookings {
      id
      checkIn
      checkOut
      guests
      status
      room {
        roomNumber
        capacity
        type
        hotel {
          name
          location
          images
        }
      }
      createdAt
    }
  }
`;


export const cancelBookingMutation = `
  mutation CancelBooking($id: ID!) {
    cancelBooking(id: $id) {
      id
      status
    }
  }
`;
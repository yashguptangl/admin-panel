interface Owner {
  id: number;
  username: string;
  email: string;
  mobile: string;
}

interface HourlyRoomOwner extends Owner {
  isPhoneVerified: boolean;
  points: number;
  isKYCVerified: boolean;
  role: string;
}

interface Images {
  front: string;
  inside: string;
  lobby: string;
  kitchen?: string;
  toilet: string;
  bathroom: string;
}

export default interface FlatData {
  flat: {
    id: number;
    ownerId: number;
    Type: string;
    city: string;
    townSector: string;
    location: string;
    landmark: string;
    BHK: string;
    MaxPrice: string;
    MinPrice: string;
    Offer: string;
    security: string;
    maintenance: string;
    totalFlat: number;
    Adress: string;
    totalFloor: number;
    waterSupply: string;
    powerBackup: string;
    noticePeriod: string;
    furnishingType: string;
    accomoType: string;
    parking: string[];
    preferTenants: string[];
    petsAllowed: boolean;
    genderPrefer: string;
    flatType: string;
    careTaker: string;
    listingShowNo: string;
    flatInside: string[];
    flatOutside: string[];
    isVerified: boolean;
    verificationPending: boolean;
    paymentDone: boolean;
    isVisible: boolean;
    isDraft: boolean;
    updatedByOwner: string;
    verifiedByAdminOrAgent: string;
  };
  images: Images;
  owner: Owner;
  message: string;
}


export interface HourlyRoomData {
  hourlyRoom: {
    id: number;
    ownerId: number;
    Type: string;
    city: string;
    townSector: string;
    location: string;
    landmark: string;
    palaceName: string;
    BedCount: number;
    MinPrice: string;
    MaxPrice: string;
    adress: string;
    totalRoom: number;
    totalFloor: string;
    noofGuests: number;
    furnishingType: string;
    accomoType: string;
    acType: string;
    parking: string[];
    foodAvailable: boolean;
    preferTenants: string[];
    genderPrefer: string;
    roomType: string;
    roomInside: string[];
    roomOutside: string[];
    manager: string;
    isVerified: boolean;
    verificationPending: boolean;
    paymentDone: boolean;
    isVisible: boolean;
    isDraft: boolean;
    updatedByOwner: string;
    verifiedByAdminOrAgent: string;
    postPropertyByAdmin: boolean;
    listingShowNo: string;
  };
  owner: HourlyRoomOwner;
  images: Images;
  message: string;
}

export interface PgOwner extends Owner {
  isPhoneVerified: boolean;
  points: number;
  isKYCVerified: boolean;
  role: string;
}

export interface PgImages {
  front: string;
  inside: string;
  toilet: string;
  bathroom: string;
  lobby: string;
  kitchen: string;
}

export interface PgData {
  pg: {
    id: number;
    ownerId: number;
    Type: string;
    city: string;
    townSector: string;
    location: string;
    landmark: string;
    BHK: string;
    MinPrice: string;
    MaxPrice: string;
    adress: string;
    Offer: string;
    security: string;
    maintenance: string;
    totalPG: number;
    waterSupply: string;
    PGType: string;
    bedCount: number;
    powerBackup: string;
    noticePeriod: string;
    furnishingType: string;
    accomoType: string;
    foodAvailable: boolean;
    parking: string[];
    preferTenants: string[];
    genderPrefer: string;
    timeRestrict: boolean;
    PGInside: string[];
    PGOutside: string[];
    careTaker: string;
    listingShowNo: string;
    isVerified: boolean;
    verificationPending: boolean;
    paymentDone: boolean;
    isVisible: boolean;
    isDraft: boolean;
    updatedByOwner: string;
    verifiedByAdminOrAgent: string;
    totalFloor: string;
    postPropertyByAdmin: boolean;
  };
  owner: PgOwner;
  images: PgImages;
  message: string;
}


export interface RoomOwner extends Owner {
  isPhoneVerified: boolean;
  points: number;
  isKYCVerified: boolean;
  role: string;
}

export interface RoomImages {
  front: string;
  inside: string;
  lobby: string;
  kitchen: string;
  toilet: string;
  bathroom: string;
}

export interface RoomData {
  room: {
    id: number;
    ownerId: number;
    Type: string;
    city: string;
    townSector: string;
    location: string;
    BHK: string;
    landmark: string;
    MinPrice: string;
    MaxPrice: string;
    Offer: string;
    adress: string;
    security: string;
    maintenance: string;
    totalRoom: number;
    powerBackup: string;
    noticePeriod: string;
    waterSupply: string;
    furnishingType: string;
    accomoType: string;
    parking: string[];
    preferTenants: string[];
    genderPrefer: string;
    roomType: string;
    roomInside: string[];
    roomOutside: string[];
    careTaker: string;
    listingShowNo: string;
    RoomAvailable: string;
    isVerified: boolean;
    verificationPending: boolean;
    paymentDone: boolean;
    isVisible: boolean;
    isDraft: boolean;
    updatedByOwner: string;
    verifiedByAdminOrAgent: string;
    totalFloor: string;
    postPropertyByAdmin: boolean;
  };
  owner: RoomOwner;
  images: RoomImages;
  message: string;
}

import { PointOfServiceType } from "@/enums/PointOfServiceType"

export interface PointOfServiceTypeIconMappingType {
	code: PointOfServiceType
	icon: string
}

export const POINT_OF_SERVICE_MAPPING: PointOfServiceTypeIconMappingType[] = [
	{ code: PointOfServiceType.NEED_HELP, icon: "🆘" },
	{ code: PointOfServiceType.LOOKING_FOR, icon: "👀" },
	{ code: PointOfServiceType.SELLING, icon: "💲" },
	{ code: PointOfServiceType.GIVE_AWAY, icon: "💲" }
]

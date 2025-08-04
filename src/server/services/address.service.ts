// import type { Address } from "@prisma/client";

import { buildCrudService } from "@/server/services/base.service";
import type { Address } from "prisma/interfaces";

export const AddressService = buildCrudService<Address>("address");

import { MenuItem } from "@/types/menu-type";
import { UserRole } from "@repo/shared-types";

export function filterMenuByRole(menu: MenuItem[], role: UserRole): MenuItem[] {
  return menu
    .filter((item) => item.roles?.includes(role))
    .map((item) => {
      if (item.items) {
        return {
          ...item,
          items: filterMenuByRole(item.items, role),
        };
      }
      return item;
    });
}

import { expect, test } from "vitest"
import { getProjectCompany } from "@/components/ProjectCompanyLogo"
import { getProjectBySlug } from "@/lib/content"

test("maps work projects to their company", () => {
  expect(getProjectCompany(getProjectBySlug("lyft-international")!)).toBe("lyft")
  expect(getProjectCompany(getProjectBySlug("ai-engineering")!)).toBe("lyft")
  expect(getProjectCompany(getProjectBySlug("search-skywatch")!)).toBe(
    "skywatch"
  )
  expect(getProjectCompany(getProjectBySlug("ge-microservices")!)).toBe("ge")
  expect(getProjectCompany(getProjectBySlug("days-gone")!)).toBeUndefined()
})

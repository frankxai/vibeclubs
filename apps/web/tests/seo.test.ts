import { test, expect } from 'vitest'
import { metadata as exploreMetadata } from '../app/explore/page'
import { metadata as developersMetadata } from '../app/developers/page'
import { metadata as extensionMetadata } from '../app/extension/page'
import { metadata as startMetadata } from '../app/start/page'
import { metadata as homeMetadata } from '../app/page'
import { metadata as playbookMetadata } from '../app/playbook/page'
import { metadata as signinMetadata } from '../app/signin/page'
import { metadata as privacyMetadata } from '../app/privacy/page'
import { metadata as termsMetadata } from '../app/terms/page'

test('metadata exists for public routes', () => {
  expect(homeMetadata.title).toBeDefined()
  expect(homeMetadata.alternates?.canonical).toBeDefined()

  expect(exploreMetadata.title).toBeDefined()
  expect(exploreMetadata.alternates?.canonical).toBeDefined()
  expect(exploreMetadata.openGraph).toBeDefined()

  expect(developersMetadata.title).toBeDefined()
  expect(developersMetadata.alternates?.canonical).toBeDefined()
  expect(developersMetadata.openGraph).toBeDefined()

  expect(extensionMetadata.title).toBeDefined()
  expect(extensionMetadata.alternates?.canonical).toBeDefined()
  expect(extensionMetadata.openGraph).toBeDefined()

  expect(startMetadata.title).toBeDefined()
  expect(startMetadata.alternates?.canonical).toBeDefined()
  expect(startMetadata.openGraph).toBeDefined()

  expect(playbookMetadata.title).toBeDefined()
  expect(playbookMetadata.alternates?.canonical).toBeDefined()
  expect(playbookMetadata.openGraph).toBeDefined()

  expect(signinMetadata.title).toBeDefined()
  expect(privacyMetadata.title).toBeDefined()
  expect(termsMetadata.title).toBeDefined()
})

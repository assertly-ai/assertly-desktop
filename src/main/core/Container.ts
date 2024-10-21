type Factory<T> = (container: Container) => T

export class Container {
  private services: Map<string, unknown> = new Map()
  private factories: Map<string, Factory<unknown>> = new Map()

  register<T>(name: string, factory: Factory<T>): void {
    this.factories.set(name, factory)
  }

  get<T>(name: string): T {
    if (this.services.has(name)) {
      return this.services.get(name) as T
    }

    const factory = this.factories.get(name)
    if (!factory) {
      throw new Error(`Service ${name} not registered`)
    }

    const instance = factory(this) as T
    this.services.set(name, instance)
    return instance
  }
}

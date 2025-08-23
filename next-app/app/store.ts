import { createReactStore, TwoAndEight } from '2n8'

class Store extends TwoAndEight {
  count = 0

  get derived() {
    return this.count + 10
  }

  buttonClicked = () => {
    this.count++
  }

  asyncButtonClicked = async () => {
    this.count++
    this.$emit()
    await new Promise((res) => {
      setTimeout(res, 2000)
    })
    this.count = this.count + 5
  }
}

export const useStore = createReactStore(new Store())

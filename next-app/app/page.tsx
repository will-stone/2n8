import { Buttons } from './buttons'
import { Count } from './count'
import { Derived } from './derived'

export default function Home(): React.JSX.Element {
  return (
    <div>
      <ul>
        <li>
          Count: <Count />
        </li>
        <li>
          Derived: <Derived />
        </li>
      </ul>
      <Buttons />
    </div>
  )
}

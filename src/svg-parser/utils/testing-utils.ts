export function testDimensions<TData>() {
  return <TIn extends TestDimensionSet<TData>>(data: TIn) => {
    return data;
  };
}

type TestDimensionSet<T> = {
  [key: string]: TestDimension<T>[];
};

type TestDimension<T> = {
  name: string;
  input: string;
  expectations: (sut: T) => void;
};

import et from 'elementtree';

class TranscriptParser {
  static parse = (data: string) => {
    const xmlElements = et.parse(data).getroot().getchildren();
    const output: any[] = [];

    xmlElements.map(element => {
      output.push({
        text: element.text,
        start: element.attrib.start,
        duration: element.attrib.dur,
      });
    });

    return output;
  };
}

export default TranscriptParser;
